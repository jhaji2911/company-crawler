import { FastifyPluginAsync } from 'fastify';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { initORM } from '../../db';
import { Client } from '../../entities';
import { TCompany, TCompanyDetails } from '../../types';
import { validate } from 'class-validator';

// TODO: optimization required

const baseURL = 'https://www.companydetails.in';

const extract: FastifyPluginAsync = async (fastify): Promise<void> => {
  // using fork we are instantiating a new separate instance of the ORM for each request, this is to prevent any potential issues with concurrent requests and database locking.
  const db = (await initORM()).em.fork();
  fastify.get('/', async (request, reply) => {
    try {
      const html = await fetchHTML(`${baseURL}/latest-registered-company-mca`);
      const companies = extractCompanies(html);

      const companyDetailsPromises = companies.map(company =>
        fetchCompanyDetails(company).catch(() => {
          return null; // Return null if there's an error
        })
      );

      const companyDetails = (await Promise.all(companyDetailsPromises)).filter(
        details => details !== null
      );

      for (let i = 0; i < companyDetails.length; i++) {
        const newClient = new Client({
          CIN: companyDetails[i]?.CIN || '',
          companyName: companyDetails[i]?.NAME || '',
          email: companyDetails[i]?.EMAIL || '',
          pinCode: companyDetails[i]?.PINCODE || '',
          address: companyDetails[i]?.ADDRESS || ''
        });

        // make sure we only take valid clients into the database
        const errors = await validate(newClient);
        if (errors.length > 0) {
          return reply.status(400).send({
            success: false,
            error: true,
            message: 'Validation failed',
            errors: errors.map(error => ({
              property: error.property,
              constraints: error.constraints
            }))
          });
        }

        db.persist(newClient);
      }
      // flushing the request to free up in memory state
      await db.flush();

      reply.send({
        success: true,
        error: false,
        message: 'Extracted data inserted in db'
      });
    } catch (err) {
      reply.status(500).send({
        success: false,
        error: true,
        message: 'Internal Server Error'
      });
    }
  });
};

async function fetchHTML(url: string): Promise<string> {
  const response = await axios.get(url);
  return response.data;
}

function extractCompanies(html: string): TCompany[] {
  const $ = cheerio.load(html);
  return $('a.fs-6')
    .map((i, elem) => ({
      name: $(elem).text(),
      link: $(elem).attr('href') ?? ''
    }))
    .get();
}

async function fetchCompanyDetails(
  company: TCompany
): Promise<TCompanyDetails> {
  const html = await fetchHTML(`${baseURL}${company.link}`);
  const $$ = cheerio.load(html);
  const companyInfo: TCompanyDetails = {
    NAME: company.name,
    CIN: '',
    EMAIL: '',
    PINCODE: '',
    ADDRESS: ''
  };

  $$('.DESC b').each((i, elem) => {
    const value = $$(elem).text().trim();
    switch (i) {
      case 3:
        companyInfo.CIN = value;
        break;
      case 7:
        companyInfo.EMAIL = value;
        break;
      case 8:
        // eslint-disable-next-line no-case-declarations
        const addressMatch = value.match(/^.+? IN\b/);
        // eslint-disable-next-line no-case-declarations
        const pincodeMatch = value.match(/\b\d{6}\b/);
        companyInfo.ADDRESS = addressMatch ? addressMatch[0] : '';
        companyInfo.PINCODE = pincodeMatch ? pincodeMatch[0] : '';
        break;
    }
  });

  return companyInfo;
}

export default extract;

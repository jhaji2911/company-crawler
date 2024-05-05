import { FastifyPluginAsync } from "fastify";
import axios from "axios";
import * as cheerio from "cheerio";

type TCompany = {
  name: string;
  link: string;
};

type TCompanyDetails = {
  NAME: string;
  CIN: string;
  EMAIL?: string;
  PINCODE?: string;
  ADDRESS?: string;
};

const baseURL = "https://www.companydetails.in";

const extract: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async (request, reply) => {
    try {
      const html = await fetchHTML(`${baseURL}/latest-registered-company-mca`);
      const companies = extractCompanies(html);

      const companyDetails = await Promise.all(
        companies.map(fetchCompanyDetails)
      );

      reply.send({ companyDetails });
    } catch (err) {
      console.error("Error fetching company names:", err);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
};

async function fetchHTML(url: string): Promise<string> {
  const response = await axios.get(url);
  return response.data;
}

function extractCompanies(html: string): TCompany[] {
  const $ = cheerio.load(html);
  return $("a.fs-6").map((i, elem) => ({
      name: $(elem).text(),
      link: $(elem).attr("href") ?? "",
  })).get();
}

async function fetchCompanyDetails(company: TCompany): Promise<TCompanyDetails> {
  const html = await fetchHTML(`${baseURL}${company.link}`);
  const $$ = cheerio.load(html);
  const companyInfo: TCompanyDetails = { NAME: company.name, CIN: "", EMAIL: "", PINCODE: "", ADDRESS: "" };

  $$(".DESC b").each((i, elem) => {
    const value = $$(elem).text().trim();
    switch (i) {
      case 3:
        companyInfo.CIN = value;
        break;
      case 7:
        companyInfo.EMAIL = value;
        break;
      case 8:
      const addressMatch = value.match(/^.+? IN\b/);
      const pincodeMatch = value.match(/\b\d{6}\b/);
        companyInfo.ADDRESS = addressMatch ? addressMatch[0] : '';
        companyInfo.PINCODE = pincodeMatch ? pincodeMatch[0] : '';
        break;
    }
  });

  return companyInfo;
}

export default extract;

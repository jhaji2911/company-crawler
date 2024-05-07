  
  export interface State {
    isExtracted: boolean;
    clients: Client[] | [];
    totalClients: number;
    }
    

    export type Client = {
      id: string;
      createdAt: string;
      CIN: string;
      companyName: string;
      email: string;
    };
    
    export type SearchApiResponse = {
      success: boolean;
      error: boolean;
      message: string;
      data: Client[];
    };
    

    export interface ValidationError {
      property: string;
      constraints: {
        [key: string]: string;
      };
    }
    
    export interface ValidationErrorResponse {
      success: false;
      error: true;
      message: string;
      errors: ValidationError[];
    }


    export interface ClientData {
      id: string;
      createdAt: string;
      updatedAt: string;
      CIN: string;
      companyName: string;
      email: string;
      pinCode: string;
      address: string;
    }
    
    export interface SuccessResponse {
      success: true;
      error: false;
      message: string;
      data: ClientData;
    }

    export interface SuccessCountResponse {
      success: true;
      error: false;
      message: string;
      data: {
        count: number;
      };
    }
    
    
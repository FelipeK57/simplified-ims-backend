import * as express from "express";

declare global {
  namespace Express {
    export interface Request {
      auth?: {
        userId: number;
        storeId: number;
        role: string;
        email: string;
      };
    }
  }
}

type TEST = string;
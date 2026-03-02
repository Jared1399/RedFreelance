import { WebpayPlus } from 'transbank-sdk';
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

const isProduction = process.env.NODE_ENV === 'production';

export const tx = new WebpayPlus.Transaction(
  new Options(
    isProduction ? process.env.TBK_COMMERCE_CODE! : IntegrationCommerceCodes.WEBPAY_PLUS,
    isProduction ? process.env.TBK_API_KEY! : IntegrationApiKeys.WEBPAY,
    isProduction ? Environment.Production : Environment.Integration
  )
);
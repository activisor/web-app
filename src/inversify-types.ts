/**
 * Inversify types
 */

const TYPES = {
    Randomization: Symbol.for('Randomization'),
    SheetsManagement: Symbol.for('SheetsManagement'),
    DateRangeParse: Symbol.for('DateRangeParse'),
    SheetSpecification: Symbol.for('SheetSpecification'),
    EmailExtraction: Symbol.for('EmailExtraction'),
    EmailExtractProcessing: Symbol.for('EmailExtractProcessing'),
    Notification: Symbol.for('Notification'),
    Referral: Symbol.for('Referral'),
    SpamValidation: Symbol.for('SpamValidation'),

    DEVARIANCE_COEF: Symbol.for('DEVARIANCE_COEF'),
    SCHEDULER_TO_DOMAIN: Symbol.for('SCHEDULER_TO_DOMAIN'),
    SCHEDULER_FROM_EMAIL: Symbol.for('SCHEDULER_FROM_EMAIL'),
    SENDGRID_API_KEY: Symbol.for('SENDGRID_API_KEY'),
    SENDGRID_NOTIFY_TEMPLATE_ID: Symbol.for('SENDGRID_NOTIFY_TEMPLATE_ID'),
    SENDGRID_REFER_TEMPLATE_ID: Symbol.for('SENDGRID_REFER_TEMPLATE_ID'),
    SENDGRID_SCHEDULE_TEMPLATE_ID: Symbol.for('SENDGRID_SCHEDULE_TEMPLATE_ID'),
};

export { TYPES };
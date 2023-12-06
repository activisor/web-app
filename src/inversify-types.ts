/**
 * Inversify types
 */

const TYPES = {
    Randomization: Symbol.for('Randomization'),
    SheetsManagement: Symbol.for('SheetsManagement'),
    DateRangeParse: Symbol.for('DateRangeParse'),
    SheetSpecification: Symbol.for('SheetSpecification'),
    SendGridEmailExtractor: Symbol.for('SendGridEmailExtractor'),
    SendGridEmailResponder: Symbol.for('SendGridEmailResponder'),
    DEVARIANCE_COEF: Symbol.for('DEVARIANCE_COEF'),
    SCHEDULER_TO_DOMAIN: Symbol.for('SCHEDULER_TO_DOMAIN'),
    SCHEDULER_FROM_EMAIL: Symbol.for('SCHEDULER_FROM_EMAIL'),
    SENDGRID_API_KEY: Symbol.for('SENDGRID_API_KEY'),
    SENDGRID_TEMPLATE_ID: Symbol.for('SENDGRID_TEMPLATE_ID'),
};

export { TYPES };
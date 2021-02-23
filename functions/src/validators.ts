
import { body } from 'express-validator';


export const userCreationValidators = [
    body('email').notEmpty().isEmail().withMessage("Contrator Email is invalid!"),
    body('contractor_name').notEmpty().isString().withMessage("Contrator name is invalid!"),
    body('mob_number').notEmpty().isMobilePhone("any").withMessage("Mobile number is invalid!"),
    body('business_name').notEmpty().isString().withMessage("Bussiness name is invalid!"),
    body('company_name').notEmpty().isString().withMessage("Company name is invalid!"),
    body('password').notEmpty().isString().withMessage("Password is invalid!"),
]; 

export const mobileValidators = [
    body('mob_number').notEmpty().isMobilePhone("any").withMessage("Mobile number is invalid!"),
];
export const loginValidators = [
    body('email').notEmpty().isEmail().withMessage("Email is invalid!"),
    // body('password').isString().withMessage("Password is invalid!"),
];
export const scheduleValidators = [
    body('email').notEmpty().isEmail().withMessage("Contrator Email is invalid!"),
    body('contractorName').notEmpty().isString().withMessage("Contrator name is invalid!"),
    body('phoneNumber').notEmpty().isMobilePhone("any").withMessage("Mobile number is invalid!"),
    body('lockBoxCode').isString().withMessage("LockBoxCode is invalid!"),
    body('serviceLocation').notEmpty().isString().withMessage("service Location is invalid!"),
    body('lossType').notEmpty().isString().withMessage("lossType is invalid!"),
    body('livingSpace').notEmpty().isString().withMessage("livingSpace is invalid!"),
    body('numberOfFurnace').notEmpty().isString().withMessage("numberOfFurnace is invalid!"),
    body('serviceDate').notEmpty().isString().withMessage("serviceDate is invalid!"),
]; 
export const insulationEstimateValidators = [
    body('email').notEmpty().isEmail().withMessage("Contrator Email is invalid!"),
    body('contractorName').notEmpty().isString().withMessage("Contrator name is invalid!"),
    body('phoneNumber').notEmpty().isMobilePhone("any").withMessage("Mobile number is invalid!"),
    body('lockBoxCode').isString().withMessage("LockBoxCode is invalid!"),
    body('serviceLocation').notEmpty().isString().withMessage("service Location is invalid!"),
    body('insulationType').notEmpty().isString().withMessage("insulationType is invalid!"),
    body('isLadderGreater').notEmpty().isString().withMessage("isLadderGreater is invalid!"),
    body('completionDate').notEmpty().isString().withMessage("completionDate is invalid!"),
    body('isLadderGreater').notEmpty().isString().withMessage("isLadderGreater is invalid!"),
]; 
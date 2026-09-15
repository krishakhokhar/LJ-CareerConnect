const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, companyController.getCompanies);
router.get('/:id', protect, companyController.getCompanyById);
router.put('/:id', protect, authorize('ADMIN'), companyController.updateCompany);
router.delete('/:id', protect, authorize('ADMIN'), companyController.deleteCompany);

module.exports = router;

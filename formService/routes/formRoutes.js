const express = require('express');
const formController = require('../controllers/formController');

const router = express.Router();

router
    .route('/')
    .get(formController.getAllForms)
    .post(formController.createForm);

router
    .route('/:id')
    .get(formController.getFormById)
    .patch(formController.updateForm)
    .delete(formController.deleteForm);

router.post('/upload', formController.uploadFile);
router.post('/download', formController.downloadFile);

module.exports = router;

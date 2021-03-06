const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },
    requestType: {
        type: String,
        required: [true, 'Please enter request type'],
        enum: {
            values: [
                'Adding/Dropping of Course',
                'Cross Enrollment within CICS',
                'Cross Enrollment outside CICS',
                'Request for Petition Classes within CICS',
                'Request for Crediting of Courses',
                'Request for Overload',
                'Request to Override',
                'Request for Late Enrollment',
                'Request for Manual Enrollment',
                'Request for Course Description',
                'Request for Certificate of Grades',
                'Request for Leave of Absence',
                'Submission of Admission Memo',
                'Others (Dept Chair)',
                'Others (CICS Office)'
            ]
        }
    },
    requestedById: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    requestStatus: {
        type: String,
        required: [true, 'Please enter request status'],
        enum: {
            values: [
                'Pending',
                'Processing',
                'Denied',
                'Approved',
                'Pending for IT Approval',
                'Pending for IS Approval',
                'Pending for CS Approval',
                'Approved by IT',
                'Approved by IS',
                'Approved by CS',
                'Denied by IT',
                'Denied by IS',
                'Denied by CS'
            ]
        },
        default: 'Pending'
    },
    managedBy: {
        type: String,
        default: ''
    },
    requestorInfo: {
        firstName: {
            type: String,
            required: [true, 'Requestor First Name required']
        },
        middleName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            required: [true, 'Requestor Last Name required']
        },
        studentNumber: {
            type: String,
            required: [true, 'Requestor Last Name required']
        },
        email: {
            type: String,
            required: [true, 'Requestor Email required']
        },
        yearLevel: {
            type: String,
            required: [true, 'Requestor year level required'],
            enum: {
                values: [
                    '1st Year',
                    '2nd Year',
                    '3rd Year',
                    '4th Year',
                    'Irregular',
                    'Alumni'
                ]
            }
        },
        section: {
            type: String,
            required: [true, 'Requestor Section required']
        },
        course: {
            type: String,
            required: [true, 'Please enter request course'],
            enum: {
                values: [
                    'Computer Science',
                    'Information Technology',
                    'Information Systems'
                ]
            }
        },
    },
    createdAt: {
        type: Date
    },
    remarks: [{
        dateOfRemark: {
            type: Date,
            required: true,
            default: Date.now()
        },
        updatedStatus: {
            type: String,
            required: true
        },
        userUpdated: {
            type: String,
            required: true
        },
        remarksMessage: {
            type: String
        },
        returningFiles: {
            type: Array
        }
    }],
    fileRequirements: {
        type: Array,
        required: [true, 'Please attach required documents']
    },
    notes: {
        type: String
    },
    isTrash: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Request', requestSchema)
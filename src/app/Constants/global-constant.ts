export const GLOBAL_CONSTANTS = {
    ERROR: {
        serverError: {
            unauthorized_message: 'You are unauthorized, please login again',
            internal_server_message: 'Something went wrong, please try again later',
            no_role_found: 'No role assigned, please contact your administrator',
        },
        validationError: {
            common: {
                require: 'This field is required',
                phone_number: 'Please provide valid phone no.',
                name_pattern: 'Please provide valid name',
                email_pattern: 'Please provide valid email',
                alpha_numeric_pattern: 'Only accept alphabet, numbers, _ and -',
                agent_mode: 'Please select atleast one mode',
                password_length: 'Password must be minimum 8 characters',
                duplicate: 'Entered name is duplicate',
                password: 'Enter valid password',
                mismatch: 'Enter password was not matched',
                invalid_value: 'Invalid number or value',
                minimum_character: 'Minimum 3 character is required',
                password_pattern: 'New Password must contain more than 8 characters, 1 upper case letter, and 1 special character'
            },

            no_internet: 'Oops! No internet available, please wait untill connected.'
        }
    },
}
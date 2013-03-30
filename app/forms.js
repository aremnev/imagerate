var forms = require('forms'),
    fields = forms.fields,
    validators = forms.validators;

exports.LoginForm = forms.create({
    username: fields.email({required: true}),
    password: fields.password({required: true})
});
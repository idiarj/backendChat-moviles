import z from 'zod';

export const userSchema = z.object({
    firstName: z.string({
        message: 'Elprimer debe ser un string.',
        required_error: 'El nombre completo es requerido.'
    }).min(3,{
        message: 'El nombre completo debe tener al menos 2 caracteres.'
    }).max(50,{
        message: 'El nombre completo no puede tener mas de 10 caracteres.'
    }
    ),
    lastName: z.string({
        message: 'El apellido debe ser un string.',
        required_error: 'El apellido es requerido.'
    }).min(3,{
        message: 'El apellido debe tener al menos 2 caracteres.'
    }).max(50,{
        message: 'El apellido no puede tener mas de 10 caracteres.'
    }
    ),
    username: z.string({
        message: 'El username debe ser un string.',
        required_error: 'El username es requerido.'
    }).min(3, {
        message: 'El username debe tener al menos 3 caracteres.'
    }).max(20, {
        message: 'El username no puede tener mas de 20 caracteres.'
    }),
    email: z.string({
        message: 'El email debe ser un string.',
        required_error: 'El email es requerido.'
    }).email({
        message: 'El email debe ser un email valido.'
    }),
    password: z.string({
        message: 'La contraseña debe ser un string.',
        required_error: 'La contraseña es requerida.'
    }).min(8, {
        message: 'La contraseña debe tener al menos 8 caracteres.'
    }).max(50, {
        message: 'La contraseña no puede tener mas de 50 caracteres.'
    }),
    gender: z.enum(['Hombre', 'Mujer'], {
        message: 'El género debe ser "hombre" o "mujer".',
        required_error: 'El género es requerido.'
    }),
    birthDate: z.date(),
    biography: z.string({
        message: 'La biografía debe ser un string.',
        required_error: 'La biografía es requerida.'
    }).min(10, {
        message: 'La biografía debe tener al menos 10 caracteres.'
    }).max(500, {
        message: 'La biografía no puede tener mas de 500 caracteres.'
    }),
    profilePicture: z.string(),
    interestedIn: z.enum(['Hombre', 'Mujer', 'Ambos'], {
        message: 'La preferencia de género debe ser "Hombre", "Mujer" o "Ambos".',
        required_error: 'La preferencia de género es requerida.'
    }),
    securityData: z.object({
        question: z.string({
            message: 'La pregunta de seguridad debe ser un string.',
            required_error: 'La pregunta de seguridad es requerida.'
        }).min(10, {
            message: 'La pregunta de seguridad debe tener al menos 10 caracteres.'
        }).max(100, {
            message: 'La pregunta de seguridad no puede tener mas de 100 caracteres.'
        }),
        answer: z.string({
            message: 'La respuesta de seguridad debe ser un string.',
            required_error: 'La respuesta de seguridad es requerida.'
        }).min(3, {
            message: 'La respuesta de seguridad debe tener al menos 3 caracteres.'
        }).max(50, {
            message: 'La respuesta de seguridad no puede tener mas de 50 caracteres.'
        })
    })
})
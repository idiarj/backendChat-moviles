import z from 'zod';

export const ChatSchema = z.object({
    message: z.string({
        required_error: 'El mensaje es requerido',
        message: 'El mensaje debe ser un string'
    }).min(1,{
        message: 'El mensaje debe tener al menos 1 caracter'        
    }).max(80, {
        message: 'El mensaje debe tener menos de 80 caracteres'
    }),
})

export const generateKey = (length: number): string => {
    let result = '';

    const lower = 'abcdefghijklmnopkrstvwxyz'
    const upper = 'ABCDEFGHIJKLMNOPKRSTVWXYZ';
    const numbers = "0123456789";
    const specials = ".,;:!?-_=+*°&#";
    const all = lower + upper + numbers + specials;
    
    for ( let i = 0; i < length; i++ ) {
        result += all.charAt(Math.floor(Math.random() * all.length));
    }
    return result;
};

export const generateCode = (length: number): string => {
    let result = '';

    const lower = 'abcdefghijklmnopkrstvwxyz'
    const upper = 'ABCDEFGHIJKLMNOPKRSTVWXYZ';
    const numbers = "0123456789";
    const all = lower + upper + numbers;
    
    for ( let i = 0; i < length; i++ ) {
        result += all.charAt(Math.floor(Math.random() * all.length));
    }
    return result;
};
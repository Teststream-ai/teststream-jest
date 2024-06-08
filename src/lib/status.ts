export const statusMapping = (status: string) => { 
    if(status === 'passed') { 
        return 1;
    } else if (status === 'failed') { 
        return 2;
    } else if (status === 'pending') { 
        return 4;
    } else { 
        return 0
    }
}
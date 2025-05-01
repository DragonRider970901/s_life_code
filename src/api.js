export const getSets = async () => {
    try {

        const res =  await fetch('/sets.json');

        if (!res.ok) {
            throw new Error('Could not fetch the sets');
        }

        const data = await res.json();
        return data;
        
    } catch(error) {
        console.log("Error fetching sets: ", error);
        throw error;
    }
}
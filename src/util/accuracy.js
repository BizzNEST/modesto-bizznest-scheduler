

 export function calculatePairAccuracy(internPairs) {
    let isPairedByLocation = JSON.parse(sessionStorage.getItem('isPairedByLocation'));
    let isPairedByDepartment = JSON.parse(sessionStorage.getItem('isPairedByDepartment'));
    let validPairs = 0;
   
    if (!isPairedByLocation && !isPairedByDepartment) {
        console.log('No pairing filters added');
        return;
    }


    internPairs.forEach(pair => {
        const [intern1, intern2] = pair;

        let isValid = true;
       
        // console.log('Checking pair:', intern1, intern2);

        if (isPairedByLocation) {
            isValid = isValid && intern1.location === intern2.location;
            // console.log(`Location check: ${isValid}`);
        }

        if (isPairedByDepartment) {
            isValid = isValid && intern1.department === intern2.department;
            // console.log(`Department check: ${isValid}`);
        }

        if (isValid) {
            validPairs++;
            // console.log('Valid pair found');
        }
    });

    const totalPairs = internPairs.length;
    const accuracy = totalPairs > 0 ? (validPairs / totalPairs) * 100 : 0;

    console.log(`Pairing accuarcy: ${accuracy.toFixed(2)}%`);
}
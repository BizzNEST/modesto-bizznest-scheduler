

 export function calculatePairAccuracy(internPairs) {
    let isPairedByLocation = JSON.parse(sessionStorage.getItem('isPairedByLocation'));
    let isPairedByDepartment = JSON.parse(sessionStorage.getItem('isPairedByDepartment'));
    let isPairedByDifferentLocation = JSON.parse(sessionStorage.getItem('isPairedByDifferentLocation'));
    let isPairedByDifferentDepartment = JSON.parse(sessionStorage.getItem('isPairedByDifferentDepartment'));
    let validPairs = 0;

    // Check for conflicting filters
    if ((isPairedByLocation && isPairedByDifferentLocation) || (isPairedByDepartment && isPairedByDifferentDepartment)) {
        console.error('Conflicting filters applied: Same and Different Location/Department cannot be selected together.');
        return;
    }

    if (!isPairedByLocation && !isPairedByDepartment && !isPairedByDifferentLocation && !isPairedByDifferentDepartment) {
        console.log('No pairing filters added');
        return;
    }

    internPairs.forEach(pair => {
        const [intern1, intern2] = pair;
        let isValid = true;
       
        if (isPairedByLocation) {
            isValid = isValid && intern1.location === intern2.location;
        }

        if (isPairedByDepartment) {
            isValid = isValid && intern1.department === intern2.department;
        }

        if (isPairedByDifferentLocation) {
            isValid = isValid && intern1.location !== intern2.location;
        }

        if (isPairedByDifferentDepartment) {
            isValid = isValid && intern1.department !== intern2.department;
        }

        if (isValid) {
            validPairs++;
        }
    });

    const totalPairs = internPairs.length;
    const accuracy = totalPairs > 0 ? (validPairs / totalPairs) * 100 : 0;

    console.log(`Pairing accuarcy: ${accuracy.toFixed(2)}%`);
}
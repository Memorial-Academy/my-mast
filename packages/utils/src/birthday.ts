type Birthday = {
    month: number,
    year: number,
    day: number
}

export function calculateAge(birthday: Birthday) {
    let birthdayStr = `${birthday.month}/${birthday.day}/${birthday.year}`;
    let birthdayEpoch = new Date(birthdayStr);
    let today = new Date();
    
    let ageEpoch = new Date();
    ageEpoch.setTime(today.getTime() - birthdayEpoch.getTime());

    return {
        birthdayString: birthdayStr,
        years: ageEpoch.getFullYear() - 1970,
        months: ageEpoch.getMonth()
    }
}
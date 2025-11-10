export const minDate18YO = (birthDate) =>{
    const birth = new Date(birthDate);
    const today = new Date();
    const min = new Date(
        today.getFullYear()-18,
        today.getMonth(),
        today.getDate()
    );
    return birth <= min
}
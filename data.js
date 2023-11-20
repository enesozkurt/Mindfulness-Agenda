const activities =
    [{
        id: "1",
        userId: "1",
        date: '19.11.2023',
        wakeUpTime: '10:00',
        didYouEatHealthy: true,
        didYouDoSport: true,
        litresOfDrinkingWater: '2',
        todoList: [],
        notes: []
    }]

const users = [
    {
        id: "1",
        firstName: 'Enes',
        lastName: 'Özkurt',
        activities
    }
];

module.exports = {
    activities,
    users
}
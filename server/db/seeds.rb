Place.destroy_all
Activity.destroy_all
User.destroy_all

User.create!([{
    username: 'user',
    password_digest: '$2a$12$dPfumrX9SXrIMY1wrSIjY.uV4r22Tc29vZFyoAzqPSI.A5uuP2qEe', # testpass
    email: 'user@example.com',
    first_name: 'Тестов',
    last_name: 'Потребител',
    start_time: '09:00',
    end_time: '18:00',
    weekend_start_time: '10:00',
    weekend_end_time: '19:00',
}])

user_id = User.find_by(username: 'user').id

Activity.create!([
    {
        user_id: user_id,
        title: 'Събитие 1',
        description: 'Тестово събитие',
        duration: '01:00',
    },
    {
        user_id: user_id,
        title: 'Събитие 2',
        description: 'Повтарящо се събитие',
        duration: '01:30',
        repeat: 2,
    }
])


p "Created #{User.count} users"
p "Created #{Activity.count} activities"


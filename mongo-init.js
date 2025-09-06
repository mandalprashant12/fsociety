// MongoDB initialization script
db = db.getSiblingDB('task-manager');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        name: {
          bsonType: 'string',
          minLength: 1
        }
      }
    }
  }
});

db.createCollection('tasks');
db.createCollection('meetings');
db.createCollection('notifications');
db.createCollection('bookingpages');
db.createCollection('calendarintegrations');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 });
db.users.createIndex({ microsoftId: 1 });

db.tasks.createIndex({ createdBy: 1, status: 1 });
db.tasks.createIndex({ assigneeId: 1, status: 1 });
db.tasks.createIndex({ deadline: 1 });
db.tasks.createIndex({ category: 1 });
db.tasks.createIndex({ priority: 1 });

db.meetings.createIndex({ createdBy: 1, startTime: 1 });
db.meetings.createIndex({ 'attendees.id': 1 });
db.meetings.createIndex({ startTime: 1, endTime: 1 });

db.notifications.createIndex({ userId: 1, isRead: 1 });
db.notifications.createIndex({ createdAt: -1 });

db.bookingpages.createIndex({ slug: 1 }, { unique: true });
db.bookingpages.createIndex({ userId: 1 });

db.calendarintegrations.createIndex({ userId: 1, provider: 1 });

print('Database initialized successfully!');

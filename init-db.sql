-- init-db.sql
-- This script creates sample data for the User Access Management System
-- Users (passwords are hashed values of: admin123, password123, password123)
INSERT INTO "user" (
        username,
        password,
        role,
        email,
        "fullName",
        "createdAt"
    )
VALUES (
        'admin',
        '$2b$10$zZZ/J69hE.FP0zxO3cOKbefUiCt0J2VJxA9xEVoAS5UKBGSGqF7v6',
        'Admin',
        'admin@example.com',
        'System Administrator',
        CURRENT_TIMESTAMP
    ),
    (
        'manager',
        '$2b$10$HwSOBvxAVlkF4q/U3QlZ5.D7WwJHzxmjY8NrA1zvqGb2bRVGwGDfG',
        'Manager',
        'manager@example.com',
        'Team Manager',
        CURRENT_TIMESTAMP
    ),
    (
        'employee',
        '$2b$10$IFpjhH/rN6e2OTt9TS2CtONRNBUAM9r5q1wMJf.IdwLql2jQEygoy',
        'Employee',
        'employee@example.com',
        'Regular Employee',
        CURRENT_TIMESTAMP
    );
-- Software entries
INSERT INTO "software" (name, description, "accessLevels", "createdAt")
VALUES (
        'Microsoft Office',
        'Office productivity suite including Word, Excel, PowerPoint, and Outlook.',
        ARRAY ['Read', 'Write', 'Admin'],
        CURRENT_TIMESTAMP
    ),
    (
        'Adobe Creative Cloud',
        'Suite of applications for photography, video editing, web development, and graphic design.',
        ARRAY ['Read', 'Write', 'Admin'],
        CURRENT_TIMESTAMP
    ),
    (
        'Salesforce',
        'Customer relationship management platform for sales, service, marketing, and more.',
        ARRAY ['Read', 'Write'],
        CURRENT_TIMESTAMP
    ),
    (
        'Slack',
        'Business communication platform offering many IRC-style features.',
        ARRAY ['Read', 'Admin'],
        CURRENT_TIMESTAMP
    ),
    (
        'Jira',
        'Issue tracking product developed by Atlassian for agile project management.',
        ARRAY ['Read', 'Write', 'Admin'],
        CURRENT_TIMESTAMP
    );
-- Access requests
-- Pending requests
INSERT INTO "request" (
        "userId",
        "softwareId",
        "accessType",
        reason,
        status,
        "createdAt"
    )
VALUES (
        3,
        1,
        'Write',
        'Need to create and edit documents for the marketing team.',
        'Pending',
        CURRENT_TIMESTAMP - INTERVAL '2 days'
    ),
    (
        3,
        2,
        'Read',
        'Need to view design assets for upcoming project.',
        'Pending',
        CURRENT_TIMESTAMP - INTERVAL '1 day'
    );
-- Approved requests
INSERT INTO "request" (
        "userId",
        "softwareId",
        "accessType",
        reason,
        status,
        "reviewedBy",
        "reviewComment",
        "createdAt",
        "updatedAt"
    )
VALUES (
        3,
        3,
        'Read',
        'Need to view customer data for sales analysis.',
        'Approved',
        2,
        'Approved for 3 months access period.',
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        CURRENT_TIMESTAMP - INTERVAL '4 days'
    ),
    (
        3,
        4,
        'Read',
        'Need to communicate with the development team.',
        'Approved',
        2,
        'Standard access granted.',
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        CURRENT_TIMESTAMP - INTERVAL '9 days'
    );
-- Rejected requests
INSERT INTO "request" (
        "userId",
        "softwareId",
        "accessType",
        reason,
        status,
        "reviewedBy",
        "reviewComment",
        "createdAt",
        "updatedAt"
    )
VALUES (
        3,
        5,
        'Admin',
        'Need full access to manage project tasks.',
        'Rejected',
        2,
        'Admin access not justified. Please request Write access instead.',
        CURRENT_TIMESTAMP - INTERVAL '15 days',
        CURRENT_TIMESTAMP - INTERVAL '14 days'
    );
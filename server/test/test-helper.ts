export const mockRepositoryFactory = () => {
    return {
        find: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockReturnThis(),
        findOneBy: jest.fn().mockReturnThis(),
        findAndCount: jest.fn().mockReturnThis(),
        create: jest.fn().mockReturnThis(),
        save: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    };
};
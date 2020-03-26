const chai = require('chai');
const UtilService = require('../../src/components/User/service');

const { expect } = chai;

describe('UserComponent -> service', () => {

    it('UserComponent -> service -> findAll', async () => {
        const users = await UtilService.findAll();
        expect(...users).to.have.property('_id');
        expect(...users).to.have.property('email');
        expect(...users).to.have.property('fullName');
    });

    let id;

    it('UserComponent -> service -> create', async () => {
        // chai-as-promised
        const user = await UtilService.create({ email: 'test11gmail.com', fullName: 'test11' });
        id = user.id;
        expect(user).to.have.property('_id');
        expect(user).to.have.property('email');
        expect(user).to.have.property('fullName');
    });

    it('UserComponent -> service -> findById', async () => {
        const userFind = await UtilService.findById(id);
        expect(userFind).to.have.property('_id');
        expect(userFind).to.have.property('email');
        expect(userFind).to.have.property('fullName');
    });

    it('UserComponent -> service -> updateById', async () => {
        const updatedUser = await UtilService.updateById(id, { email: 'test12gmail.com', fullName: 'test12' });
        expect(updatedUser).to.have.property('n', 1);
        expect(updatedUser).to.have.property('nModified', 1);
        expect(updatedUser).to.have.property('ok', 1);
    });

    it('UserComponent -> service -> deleteById', async () => {
        const deletedUser = await UtilService.deleteById(id);
        expect(deletedUser).to.have.property('n', 1);
        expect(deletedUser).to.have.property('ok', 1);
        expect(deletedUser).to.have.property('deletedCount', 1);
    });

});

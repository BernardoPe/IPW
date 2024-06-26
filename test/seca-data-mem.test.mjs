import { expect, assert } from 'chai'


import * as secaData from '../data/seca-data-mem.mjs'
import * as secaClasses from '../seca-classes.mjs'



let username = 'asd123'
let token


let groupID
let groupname = "teste1"
let groupdescription = "grupo teste"
let userID = token

 




describe('User - Memory Data functions test', () => {

    it('addUser function', () => {
      
        const user = new secaClasses.User(username, null);
        const finalUser = secaData.addUser(user);
        token = finalUser.token
  
        expect(finalUser.token).to.not.equal(null);
        expect(secaData.users).to.not.be.empty


    });
  
    it('add an existing user', () => {
        
        const username = "DuplicateTest"
        
        const newUser = new secaClasses.User(username)
        secaData.addUser(newUser)

        const otherUser = new secaClasses.User(username)
        
        assert.throws(() => {secaData.addUser(otherUser), {code: 4, error: `DuplicateTest already exists in users`}})

    })

    it('findUser function', () => {

        const user = new secaClasses.User(username , token)
  
        const foundUser = secaData.findUser(user.token)

        userID = foundUser.token
        

        expect(foundUser).to.deep.equal(user)

    });

  
});



describe('Group - Memory Data functions test', () => {
    it('addGroup function', () => {

        const group = new secaClasses.Group(groupname,groupdescription, token)

        const addedGroup = secaData.addGroup(group)
        groupID = addedGroup.id

        expect(addedGroup.id).to.not.equal(null)
        expect(secaData.groups).to.not.be.empty

    });

    it('getGroup function', () => {
        const group = new secaClasses.Group(groupname, groupdescription, userID, groupID)
        expect(secaData.getGroup(groupID)).to.deep.equal(group)
    });

    it('updateGroup function', () => {

        
        let newGroup = new secaClasses.Group("new name", "new description", userID, groupID)

        groupname = newGroup.name
        groupdescription = newGroup.description

        expect(secaData.updateGroup(newGroup)).to.deep.equal(newGroup)

    })
    it('deleteGroup function', () => {

        const group = new secaClasses.Group(groupname, groupdescription, userID, groupID)

        secaData.deleteGroup(group)

        expect(secaData.getGroup(group.id)).to.not.exist
    
    })
})



// using one of the existing users by default

describe('Event - Memory Data functions test', () =>{
    
    it('addEvent function',async () => {

        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        
        let event ={
            id: 'G5dIZ9YmSXKWz',
            name: 'San Antonio Spurs vs. Phoenix Suns',
            date: '2024-03-26T00:00:00Z',
            genre: 'Basketball',
            segment: 'Sports'
          }
        
        let group = secaData.getGroup(localGroupID)
        
        await secaData.addEvent(group,event)

        expect(group.events).to.not.empty

        expect(group.events).to.deep.equal([event])

        
    })

    it('getEventIndex function - existing event', () =>{
        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEvenId = 'G5dIZ9YmSXKWz'
        let group = secaData.getGroup(localGroupID)
        expect(secaData.getEventIndex(group, localEvenId)).to.be.equal(0)

    })

    it('removeEvent function - existing event', () =>{
        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEvenId = 'G5dIZ9YmSXKWz'
        let group = secaData.getGroup(localGroupID)
        secaData.removeEvent(group, localEvenId)
        expect(group.events).to.be.deep.equal(new Array)
    })

    //now the event got removed


    it('getEventIndex function - non existing event', () =>{

        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEvenId = 'G5dIZ9YmSXKWz'
        let group = secaData.getGroup(localGroupID)
        expect(secaData.getEventIndex(group, localEvenId)).to.be.equal(-1)

    })

    it('removeEvent function - non existing event', () => {
        const localGroupID = 'a5ab7d81-f7df-4d76-9acf-0d3c0c73649f'
        const localEvenId = 'G5dIZ9YmSXKWz'
        let group = secaData.getGroup(localGroupID)

        assert.throws(() => {secaData.removeEvent(group, localEvenId), {code: 3, error: `Event with ${ localEvenId } in group ${group.name} not found` }})
    
    })




})

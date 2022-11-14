const socket = io('/')
const videoGrid = document.getElementById('video_call')
const peer = new Peer(undefined)
const myVideo = document.createElement('video')
const mySpan = document.createElement('span')
let u_id = 1
myVideo.muted = true
const peers = {}
let check = []
console.log(id)

socket.on('user-connected', userId => {
    console.log("user id:" + userId)
})
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addvideo(mySpan, myVideo, stream)
    peer.on('call', call => {
        //answer the call 
        call.answer(stream);
        const video = document.createElement('video')
        const span = document.createElement('span')
        call.on('stream', function (userVideoStream) {
            addvideo(span, video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        //send a message to server that i am new user
        connectToNewUser(userId, stream)
    })
})
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
    check.pop(userId)
})

peer.on('open', user_ID => {
    socket.emit('join-room', id, user_ID)//id is room ID,
})
function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream)//create a call
    const span= document.createElement('span')
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      // add new vieo   
      addvideo(span,video, userVideoStream)
    })
    call.on('close', () => {
      //when close remove
      span.remove()
      video.remove()
    })
  
    peers[userId] = call
  }
function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function addvideo(sp, video, stream) {
    x = (check.includes(stream['id']))
    if (!x) {
        check.push(stream['id'])
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        sp.innerHTML = 'User id'+ stream['id']
        sp.id = stream['id']
        u_id++;
        videoGrid.append(sp)
        sp.append(video);
    }
}

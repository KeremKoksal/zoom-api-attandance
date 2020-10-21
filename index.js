//include required modules
const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
var email, userid, resp;
const port = 3000;

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);


//get the form 
app.get('/', (req, res) => res.send(req.body));

//use userinfo from the form and make a post request to /userinfo
app.post('/participants', (req, res) => {
    //store the email address of the user in the email variable
    email = req.body.email;
    from = req.body.from;
    to = req.body.to;
    //check if the email was stored in the console
    console.log(email);
    //Store the options for Zoom API which will be used to make an API call later.
    var options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/" + email,
        qs: {
            status: 'active'
        },
        auth: {
            'bearer': token
        },
        headers: {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json'
        },
        json: true
    };
    rp(options)
        .then(function (response) {
            let userId = response.id;

            rp({
                uri: "https://api.zoom.us/v2/report/users/" + userId + "/meetings",
                qs: {
                    type: "past",
                    page_size: 300,
                    to: to,
                    from: from,
                },
                auth: {
                    'bearer': token
                },
                headers: {
                    'User-Agent': 'Zoom-api-Jwt-Request',
                    'content-type': 'application/json'
                },
                json: true

            }).then(async function (res2) {

                let meetings = res2.meetings;
                let participantNames = [];
                let table = '<table><tr><td></td>';

                for (const meeting of meetings) {
                    await rp({
                        uri: `https://api.zoom.us/v2/report/meetings/${meeting.uuid}/participants`,
                        qs: { page_size: '300' },
                        auth: {
                            'bearer': token
                        },
                        headers: {
                            'User-Agent': 'Zoom-api-Jwt-Request',
                            'content-type': 'application/json'
                        },
                        json: true
                    }).then((res3) => {

                        meeting.participants = groupByParticipant(res3.participants)

                        for (const participant of meeting.participants) {
                            let name = participant.name.toUpperCase()
                            if (name !== meeting.user_name.toUpperCase())
                                if (participantNames.indexOf(name) === -1)
                                    participantNames.push(name)
                        }
                        table += `<td> ${new Date(meeting.start_time).toLocaleDateString()} <br> ${new Date(meeting.start_time).toLocaleTimeString()} <br> ${new Date(meeting.end_time).toLocaleTimeString()} </td>`
                    }, (err) => {
                        console.log(err)
                    })
                }

                participantNames.sort()
                '</tr>'
                for (const participant of participantNames) {
                    table += `<tr><td> ${participant} </td>`
                    for (const meeting of meetings) {
                        if (meeting.participants)
                            if (meeting.participants.find(item => item.name === participant)) {
                                duration = meeting.participants.find(item => item.name === participant).duration
                                table += `<td> ${Math.ceil(duration / 60)} </td> `;
                            }
                            else
                                table += '<td>0</td>'

                    }
                    table += '</tr>'
                }
                table += '</table><style>table{border-collapse:collapse;}table, th, td {border: 1px solid black;padding: 4px;}</style>'


                res.send(table);
            })



        })
        .catch(function (err) {
            // API call failed...
            console.log('API call failed, reason ', err);
        });


});

const groupByParticipant = (participants) => {
    let grouped = [];
    for (const participant of participants) {
        let name = participant.name.toUpperCase();
        if (grouped.find(o => o.name === name)) {
            let item = grouped.find(o => o.name === name)
            item.duration += participant.duration;
        } else
            grouped.push({ name: name, duration: participant.duration });
    }
    return grouped;
}
app.listen(port, () => console.log(`Attendance app listening on port ${port}!`));



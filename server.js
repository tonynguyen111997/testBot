require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('THIS WORKS!!');
});

app.post('/bot', (req, res) => {
  const { challenge } = req.body;
  const { event } = req.body;

  if(!event){
    res.send(challenge);
  }

  let formData = {
    channel: "bot",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Hello, below are the available teams for *Hack Day September 2019*. If you'd like to learn more about Hack Day, please visit our Hack Day website at ..."
        }
      },
      {
        type: "divider"
      },
          {
            type: "section",
              text: {
          type: "mrkdwn",
          text: "*<https://www.meetup.com/iesd-meetup/events/264486598/| Hack Day September 2019>*\nSaturday, September 28 2:30-7:00pm\nExCite Riverside\n32 members have RSVP\n\n\n *Here are the current teams:*"
        },
              accessory: {
                type: "image",
                  "image_url": "https://secure.meetupstatic.com/photos/event/8/a/a/9/highres_484355497.jpeg",
                  "alt_text": "test"
              }
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Leet Coders (2)*\nJosh, Bill"
            },
            accessory: {
              type: "button",
              text: {
                          type: "plain_text",
                        text: "Choose"
                      }
            }
          },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Trader Joe's pizza is expensive (5)*\nRyan, Greg, David, Andy, Tony"
        }
      },
          {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*PRo Coders (3)*\nBob, Jake, Joe"
        },
        accessory: {
          type: "button",
          text: {
                      type: "plain_text",
                    text: "Invite Only"
                  }
        }
      },
      {
        type: "divider"
      },
          {
            type: "actions",
              elements: [
                  {
                    type: "button",
                      text: {
                        type: "plain_text",
                        text: "Create a team",
                      },
                      action_id: "create_team"
                  }
              ]
          }
    ]
  }

  let config = {
    headers: {'Authorization': "Bearer " + process.env.BOTS_TOKEN}
  }

  if(event.type === "app_mention"){
    if(event.text.includes("teams")){
      console.log("Sending...");
      axios.post('https://slack.com/api/chat.postMessage', formData, config)
      .then(response => {
        console.log("SUCCESS");
        console.log('response', response.data);
        res.sendStatus(200);
      })
      .catch(err => console.log("Fail", err))
    } else {
      res.send(challenge);
    }
  }

  res.sendStatus(200);
})

app.post("/actions", (req, res) => {
  if(JSON.parse(req.body.payload).actions[0].action_id === 'create_team'){
    console.log(JSON.parse(req.body.payload))
    const parseData = JSON.parse(req.body.payload);
    const trigger_id = parseData.trigger_id;
    // console.log(parseData.view.state.values);
    if(JSON.parse(req.body.payload).type === "view_submission"){
      // console.log(parseData.view.state.values);
      // for(let value in parseData.view.state.values){
      //   console.log(value);
      //   if(parseData.view.state.values[value].hasOwnProperty('team_name')){
      //     console.log("TEAM NAME", parseData.view.state.values[value].team_name.value);
      //   } else if(parseData.view.state.values[value].hasOwnProperty('members')){
      //     console.log(parseData.view.state.values[value].members.selected_users);
      //   } else {
      //     console.log(parseData.view.state.values[value].group_settings.selected_option);
      //   }
      }
      return res.sendStatus(200);
    }
  
    let config = {
      headers: {'Authorization': "Bearer " + process.env.BOTS_TOKEN}
    }
  
    let formData = {
      trigger_id,
      view: {
        title: {
          type: "plain_text",
          text: "Create a team",
          emoji: true
        },
        type: "modal",
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true
        },
        submit: {
          type: "plain_text",
          text: "Create",
          emoji: true
        },
        blocks: [
          {
            type: "input",
            element: {
              type: "plain_text_input",
              action_id: "team_name",
              placeholder: {
                type: "plain_text",
                text: "What would you like to name your team?"
              }
            },
            label: {
              type: "plain_text",
              text: "Team Name"
            }
          },
          {
            type: "input",
            element: {
              type: "multi_users_select",
              action_id: "members",
              placeholder: {
                type: "plain_text",
                text: "Who else will be working with you?"
              }
            },
            label: {
              type: "plain_text",
              text: "Members"
            }
              },
              {
                type: "input",
                  element: {
                    type: "static_select",
                    action_id: "group_settings",
                      placeholder: {
                type: "plain_text",
                text: "Select an item",
                emoji: true
              },
                      "options": [
                {
                  text: {
                    type: "plain_text",
                    text: "Open",
                    emoji: true
                  },
                  value: "open"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Invite Only",
                    emoji: true
                  },
                  value: "invite"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Closed",
                    emoji: true
                  },
                  value: "closed"
                }
              ]
                  },
            label: {
              type: "plain_text",
              text: "Group Settings"
            }
              }
        ]
      }
    }
  
    axios.post("https://slack.com/api/views.open", formData, config);
  }
  
  res.sendStatus(200);
})

app.listen(process.env.PORT, () => {
  console.log(`Server is listening to port ${process.env.PORT}`);
});


// {
// 	blocks: [
// 		{
// 			type: "section",
// 			text: {
// 				type: "mrkdwn",
// 				text: "Hello, below are the available teams for *Hack Day September 2019*. If you'd like to learn more about Hack Day, please visit our Hack Day website at ..."
// 			}
// 		},
// 		{
// 			type: "divider"
// 		},
//         {
//         	type: "section",
//             text: {
// 				type: "mrkdwn",
// 				text: "*<https://www.meetup.com/iesd-meetup/events/264486598/| Hack Day September 2019>*\nSaturday, September 28 2:30-7:00pm\nExCite Riverside\n32 members have RSVP\n\n\n *Here are the current teams:*"
// 			},
//             accessory: {
//             	type: "image",
//                 "image_url": "https://secure.meetupstatic.com/photos/event/8/a/a/9/highres_484355497.jpeg",
//                 "alt_text": "test"
//             }
//         },
//         {
//         	type: "divider"
//         },
// 		{
// 			type: "section",
// 			text: {
// 				type: "mrkdwn",
// 				text: "*Team Name Here (5)*\nRyan, Greg, David, Andy, Tony"
// 			},
// 			accessory: {
// 				type: "button",
// 				text: {
//                     type: "plain_text",
//                 	text: "Choose"
//                 }
// 			}
// 		},
//         {
// 			type: "section",
// 			text: {
// 				type: "mrkdwn",
// 				text: "*PRo Coders (5)*\nBob, Jake, Joe"
// 			},
// 			accessory: {
// 				type: "button",
// 				text: {
//                     type: "plain_text",
//                 	text: "Invite Only"
//                 }
// 			}
// 		},
// 		{
// 			type: "divider"
// 		},
//         {
//         	type: "actions",
//             elements: [
//                 {
//                 	type: "button",
//                     text: {
//                         type: "plain_text",
//                     	text: "Create a team"
//                     }
//                 }
//             ]
//         }
// 	]
// }


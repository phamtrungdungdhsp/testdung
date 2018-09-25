"use strict";
const login = require("facebook-chat-api");
const request = require("request");

module.exports = function (io) {
    io.on('connection', async function (socket) {
        socket.on('disconnect', function () {

        });

        /**
         * Socket gửi tin nhắn
         */
        socket.on('send-message', function (facebookAccount) {
            login({email: facebookAccount.userName, password: facebookAccount.password}, (err, api) => {
                if (err) {
                    socket.emit("send-message", {
                        error: true,
                        message: "Không thể kết nối đến tài khoản facebook"
                    });
                } else {
                    socket.on('disconnect', function () {
                        api.logout();
                    });

                    socket.on("send-message-item", (itemMessage) => {
                        api.sendMessage({body: itemMessage.message}, itemMessage.uid, (error, infoSuccess) => {
                            socket.emit("send-message-item", {
                                message: itemMessage.message,
                                userData: itemMessage.userData,
                                index: itemMessage.index,
                                error: !!error,
                            });
                        });
                    });

                    socket.emit("send-message", {
                        error: false,
                        message: "Đăng nhập thành công"
                    });
                }
            });
        });

        /**
         * Socket gửi lời mời kết bạn
         */
        socket.on('send-invite-request', function (cookies) {
            request.get({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
                    'Cookie': `c_user=${cookies.c_user}; xs=${cookies.xs}`,
                    'Host': 'www.facebook.com'
                },
                url: `https://www.facebook.com/`,
            }, async function (error, response, body) {
                let stringHtml = body.toString();

                function find__spin_t() {
                    try {
                        return new RegExp('__spin_t":(.+?),').exec(stringHtml)[ 1 ];
                    } catch (e) {
                        return "";
                    }
                }

                function find___spin_r() {
                    try {
                        return new RegExp('__spin_r":(.+?),').exec(stringHtml)[ 1 ];
                    } catch (e) {
                        return "";
                    }
                }

                let __spin_t = find__spin_t();
                let __spin_r = find___spin_r();
                let fb_dtsg = stringHtml.split('<input type="hidden" name="fb_dtsg" value="')[ 1 ].split('"')[ 0 ];


                socket.on("send-invite-friend-item", (itemUid) => {
                    request.post({
                        headers: {
                            'accept-encoding': 'gzip, deflate, br',
                            'content-type': 'application/x-www-form-urlencoded',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
                            'Cookie': `c_user=${cookies.c_user}; xs=${cookies.xs}`,
                        },
                        url: `https://www.facebook.com/ajax/add_friend/action.php?dpr=2`,
                        body: `to_friend=${itemUid}&action=add_friend&how_found=profile_button&ref_param=ufi&link_data[gt][type]=xtracking&link_data[gt][xt]=48.%7B%22event%22%3A%22add_friend%22%2C%22intent_status%22%3Anull%2C%22intent_type%22%3Anull%2C%22profile_id%22%3A${itemUid}%2C%22ref%22%3A1%7D&link_data[gt][profile_owner]=${itemUid}&link_data[gt][ref]=timeline%3Atimeline&outgoing_id=&logging_location=&no_flyout_on_click=true&ego_log_data&http_referer=https%3A%2F%2Fwww.facebook.com%2F&floc=profile_button&frefs[0]=ufi&__user=${cookies.c_user}&__a=1&__req=r&__be=1&fb_dtsg=${fb_dtsg}&__spin_r=${__spin_r}&__spin_b=trunk&__spin_t=${__spin_t}`
                    }, async function (error, response, body) {
                        socket.emit("send-invite-friend-item", {
                            itemUid: itemUid,
                            error: false,
                        });
                    });
                });

                socket.emit("send-invite-request", {
                    error: false,
                    message: "Đăng nhập thành công"
                });
            });
        });
    });
};
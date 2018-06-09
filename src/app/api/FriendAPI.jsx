/**
 * Get the following users
 * @param {object} circles 
 */
export const getFriends = (circles) => {
    let followingUsers = {};
    Object.keys(circles).forEach((cid) => {
        if (cid.trim() !== '-Followers' && circles[cid].users) {
            Object.keys(circles[cid].users).forEach((userId) => {
                let isExist = Object.keys(followingUsers).indexOf(userId) > -1;
                if (!isExist) {
                    followingUsers[userId] = {
                        ...circles[cid].users[userId]
                    };
                }
            });
        }
    });

    return followingUsers;
}

export default {
    getFriends,
};
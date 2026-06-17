const redis =
require("../config/redis");

module.exports =
async (req, res, next) => {

    const { userId } = req.body;

    const key =
        `notify:${userId}`;

    const count =
        await redis.incr(key);

    if(count === 1)
        await redis.expire(key, 60);

    if(count > 5)
        return res
        .status(429)
        .json({
            message:
            "Too many notifications"
        });

    next();
};
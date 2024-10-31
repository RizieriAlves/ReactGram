import { requestConfig, api } from "../utils/config";

const getActualData = async (res, token) => {
  let new_res;
  if (Array.isArray(res)) {
    new_res = [...res];
  } else {
    new_res = [res];
  }
  const setIds = new Set();

  new_res.forEach((photo) => {
    setIds.add(photo.userId);
    photo.comments?.forEach((comment) => {
      setIds.add(comment.userId);
    });

    photo.likes?.forEach((id) => {
      setIds.add(id);
    });
  });

  const userIds = [...setIds];

  const userConfig = requestConfig("GET", null, token);
  const userData = await Promise.all(
    userIds.map(async (userId) => {
      const response = await fetch(api + "/users/" + userId, userConfig);

      return response.json();
    })
  );
  console.log(userData);
  const setData = userData.reduce((map, el) => {
    map[el._id] = el;
    return map;
  }, {});

  const photos = new_res.map((photo) => {
    const newphoto = { ...photo };
    newphoto.userName = setData[photo.userId].name;

    newphoto.comments =
      photo.comments?.map((comment) => {
        const newcomment = { ...comment };
        newcomment.userName = setData[comment.userId].name;
        newcomment.userImage = setData[comment.userId].profileImage || null;
        return newcomment;
      }) || [];

    newphoto.likesName = photo.likes?.map((id) => {
      const newlike = setData[id].name;
      return newlike;
    });
    return newphoto;
  });
  console.log(photos);
  return photos;
};

export default getActualData;

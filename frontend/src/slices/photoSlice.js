import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";
import getActualData from "../hooks_funcs/getActualData";
const initialState = {
  photos: [],
  photo: {},
  error: false,
  loading: false,
  message: null,
};

//funções

export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.publishPhoto(photo, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getUserPhotos(id, token);

    return data;
  }
);

export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.deletePhoto(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.updatePhoto(
      { title: photo.title },
      photo.id,
      token
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const getPhoto = createAsyncThunk("photo/get", async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;
  const data = await photoService.getPhoto(id, token);
  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }
  return data;
});

export const likePhoto = createAsyncThunk(
  "photo/like",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.likePhoto(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    const photos = await getActualData(data.photo, token);

    return photos[0];
  }
);

export const commentPhoto = createAsyncThunk(
  "photo/comment",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.commentPhoto(
      { comment: photoData.comment },
      photoData.photo._id,
      token
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getAllPhotos = createAsyncThunk(
  "photos/getphotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getAllPhotos(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const searchPhotos = createAsyncThunk(
  "photos/search",
  async (q, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.searchPhotos(q, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    console.log(data);
    return data;
  }
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
    clearPhotos: (state) => {
      state.photo = null;
      state.photos = [];
    },
  },
  extraReducers: (builder) => {
    //Ao enviar a requisição, ele irá verificar que está pending, modificando os states
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo); //igual o push,mas adiciona no inicio
        state.message = "Post realizado";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.photos = action.payload;
        state.success = true;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
        });
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(getPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(likePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedPhoto = action.payload;

        if (state.photos > 1) {
          const photoIndex = state.photos.findIndex(
            (photo) => photo._id === updatedPhoto._id
          );

          state.photos[photoIndex] = updatedPhoto;
        } else {
          state.photo = updatedPhoto;
        }
      })
      .addCase(likePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(commentPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(commentPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(state);
        if (Array.isArray(state.photo.comments)) {
          state.photo.comments.push(action.payload.comment);
        } else {
          state.photo.comments = [action.payload.comment];
        }
      })
      .addCase(commentPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.photos = [];
        state.photo = null;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage, clearPhotos } = photoSlice.actions;
export default photoSlice.reducer;

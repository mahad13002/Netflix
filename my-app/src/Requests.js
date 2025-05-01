const key = '1b90d7c5fe150073bcfd916338aaa4b1';

const requests = {
    requestPopular: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`,
    requestAction: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=28`,
    requestHorror: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=27`, 
    requestAnime: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=16`,
    requestUpcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1`,
    requestComedy: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=35`,
    requestDocumentary: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=99`,
    
};

export default requests;

const ENDPOINT = 'https://api.nasa.gov/planetary/apod';
const API_KEY = 'op0SyWUyi2mVWlPhnVhaqXWDS9Js8Yd2bLeSVvQ4';

$(document).ready(function() {
    if (window.location.pathname == '/') {
        loadImage();
    } else if (window.location.pathname == '/random.html') {
        loadRandomImage();
    }
});

// Click event
$('#descLink').click(function() {
    displayCaption();
    switchLabel();
});

// Get image from Nasa API
// If date is empty, loads today's picture
function loadImage(date) {
    var params = {
        api_key : API_KEY,
        hd: true
    };

    if (date != null) {
        params['date'] = date;
    }

    var request = $.ajax({
        url: ENDPOINT,
        data: params,
    });
    request.done(function( data ) {
        $('#img').attr('src', data.hdurl);
        $('#title').html(data.title);
        $('#date').html('Picture from : ' + data.date);
        $('#description').html(data.explanation);
    });
    request.fail(function( jqXHR, textStatus ) {
        // Maybe find a better solution?
        if (jqXHR.status == 400) {
            // No image found for this date, try again
            loadRandomImage();
        } else if (jqXHR.status == 429) {
            alert('API limit reached. Please try again in 1 hour');
        } else {
            alert('An error occured. Please refresh the page.');
        }
        console.log(textStatus);
    });
}

// Get an image using a random day from Nasa API
function loadRandomImage() {
    var date = randomDate();
    loadImage(date);
}

// Display or hide caption div
function displayCaption() {
    if ($('#caption').is(':visible')) {
        $('#caption').hide();
    } else {
        $('#caption').show();
    }
}

// Switch navbar label
function switchLabel() {
    var labelOn = 'What am I looking at?';
    var labelOff = 'Hide description';

    if ($('#caption').is(':visible')) {
        $('#descLink').text(labelOff);
    } else {
        $('#descLink').text(labelOn);
    }
}

// Random date generation in Y-m-d format
function randomDate() {
    // Oldest archive
    var oldest = 803599200;
    var timestamp = randomTimestamp(oldest, Math.floor(Date.now() / 1000));
    var date = new Date(timestamp * 1000);
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate();
}

// Returns a random timestamp (integer) in the given range
function randomTimestamp(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

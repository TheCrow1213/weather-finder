$(function() {

  $('button[type="submit"]').on('click', function(event) {
    event.preventDefault();
    var value = $('#input').val();
    var button = $(this);

    if (validate(value)) {
      showSpinner(button);
      hideResults();
      $.get('http://api.worldweatheronline.com/free/v2/weather.ashx', {
        num_of_days: 2,
        key: '56093dcfd93e4316be5155957161703',
        q: value,
        format: 'json'
      }).done(function(response) {
        handleResponse(response);
        showResults();
      }).fail(function(response) {
        console.log(response);
      }).always(function() {
        showText(button);
      });
    }
  });

  $('button#tempToggle').on('click', function(event) {
    var f = $('#tempf'), c = $('#tempc');
    if (f.is(":visible")) {
      f.fadeOut('fast', function() {
        c.fadeIn();
      });
    } else {
      c.fadeOut('fast', function() {
        f.fadeIn();
      });
    }
  })
});

function handleResponse(response) {
  var data = response.data;
  if (data.error) { showValidation(data.error[0].msg); }
  else if (data.current_condition && data.weather) {
    showConditions(data.current_condition[0]);
    showWeather(data.weather);
    console.log(response.data);
  }
}

function showConditions(conditions) {
  var tempf = conditions.temp_F;
  var tempc = conditions.temp_C;
  var humidity = conditions.humidity;
  $('#tempf #value').text(tempf);
  $('#tempc #value').text(tempc);
  $('#humidity').text(humidity);
}

function showWeather(weather) {
  var details = $('#results #weather #details');
  details.html('');
  weather.forEach(function(day) {
    details.append($('<div class="row">')
      .append($('<div class="col-md-12">')
        .append('<h5>' + day.date + '</h5>'))
      .append($('<div class="col-md-6">')
        .append('<p class="card-text"> Max (F): ' + day.maxtempF + '</p>')
        .append('<p class="card-text"> Min (F): ' + day.mintempF + '</p>'))
      .append($('<div class="col-md-6">')
        .append('<p class="card-text"> Max (C): ' + day.maxtempC + '</p>')
        .append('<p class="card-text"> Min (C): ' + day.mintempC + '</p>'))
    );
  });
}

function validate(input) {
  var message = '';
  showValidation(message);

  if (input === '') message = 'Please provide a city or zip code.';
  else if ($.isNumeric(input) && input.length !== 5) {
    message = 'Please make sure your zip code is 5 digits long.';
  } else if (!$.isNumeric(input) && !isAlpha(input)) {
    message = 'Please enter a valid city name.';
  }

  showValidation(message);
  return (message === '')
}

function showValidation(message) {
  var msgHolder = $('#validation');
  msgHolder.text(message);

  if(message !== '') {
    $('.form-group').addClass('has-danger');
    $('#input').addClass('form-control-danger');
  } else {
    $('.form-group').removeClass('has-danger');
    $('#input').removeClass('form-control-danger');
  }
}

function showSpinner(button) {
  button.html('<i class="fa fa-spinner fa-spin fa-lg"></i>');
}

function showText(button) {
  button.html('Submit');
}

function isAlpha(str) {
  return /^[a-zA-Z\s]+$/.test(str);
}

function showResults() {
  $('#results').fadeIn();
}

function hideResults() {
  $('#results').fadeOut();
}

// 4925da30d1aa95a1460e52de2c833d6c18fbba28
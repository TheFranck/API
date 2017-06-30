/*$(document).ready(function() {


getAllPlanets();

  function getOnePlanet() {

    var url = $(this).data('url');

    $.get( url, function(data) {

      var html = "";


      console.log(data);
      $('main').html('');
      html += "<div id ='planet'>";
      html += "<h1>" + data.name + "</h1>";
      html += "<p> Durée d'une journée :" + data.rotation_period + "</p>";
      html += "<p> Population totale :" + data.population + "</p>"
      html += "</div>";
      $('main').append(html);

    });
  }


  function getAllPlanets() {

    var response = $.get("http://swapi.co/api/planets/", function(data) {

      var planets = data.results;

      var html = "";
      html += "<div id='planets-list'>";
      html += "<ul>";

      $.each(planets, function(key, value){
        html += "<li data-url ='" + value.url + "'>" + value.name + "</li>";
      })

      html += "</ul>";
      html += "</div>";
      $('main').html('');
      $('main').append(html);
      $('main').on('click','#planets-list ul li', getOnePlanet);
      $('button[data-action = "home"]').on('click', getAllPlanets);

    })
  }
});
*/


$(document).ready(function() {

load();

  function createLoadingScreen() {
    var html = "";
    html += "<div id ='loading-screen'>";
    html += "<p>L'étoile noire se charge ...</p>";
    html += "<img src='loading.gif'>";
    html += "</div>";
    $('body').append(html);
  }

  function destroyLoadingScreen() {
    $('body').find('#loading-screen').remove();
  }

  function load() {


    createLoadingScreen();
    //getAllPlanets();
    setTimeout(getAllPlanets, 2000);

  }

  function getOneResident(resident) {
    var elementToHide = [
      "homeworld",
      "films",
      "created",
      "edited",
      "url",
    ]
    $('body').find('#perso-box').remove();
    var html = "";
    $.get(resident, function(result) {
      html += "<div id='perso-box'>";
      html += "<h2>" + result.name + "</h2>";
      $.each(result, function(key, value) {
        if($.inArray(key, elementToHide) !== -1) {

        } else {
          html += "<p>" + key + " : " + value + "</p>";
        }
      })
      html += "</div>";
      $('body').append(html);
    })
  };
  function getAllResidentsForPlanete(residents)
  {
    $('body').find('select option').remove();
    $('body').find('select').append("<option>Personnages</option>");
    $.each(residents, function(key, value) {
      $.ajax({
        type:'get',
        url:value,
        success:function(result) {
          $('body').find('select').append("<option value='" + result.url + "'>" + result.name + "</option>");
        },
      })
    })
    $('body').on('change','select', function() {
      getOneResident($(this).val());
    })
  }


  function getOnePlanet()
  {

    var url = $(this).data('url');

    $.get( url, function(data) {
      var residents = data.residents;
      var html = "";
      $('main').html('');
      html += "<div id='planet'>";
      html += "<h1>" + data.name + "</h1>";
      html += "<p> Durée d'une journée : " + data.rotation_period + "</p>";
      html += "<p> Population : " + data.population + "</p>";
      html += "<label>Personnages : </label>";
      html += "<select>";
      html += "<option id='load'>Chargement</option>";
      html += "</select>";
      html += "</div>";
      $('main').append(html);
      getAllResidentsForPlanete(residents);
    });
  }

  function ajaxRequest() {
    var planets = "";
      $.ajax({
        type:'get',
        url:"http://swapi.co/api/planets/",
        success:function(data) {
          planets = data.results;
            $.ajax({
              type:'get',
              url:data.next,
              success:function(data) {
                $.each(data.results, function(key, value){
                  planets.push(value);
                })
              },
              async:false
            })
        },
        async:false
      })
      return planets;
  }

  function getAllPlanets()
  {

    if(localStorage.getItem('planets') && localStorage.getItem('date')) {
      var currentDate = new Date();
      var oldDate = new Date(localStorage.getItem('date'));
      if ((currentDate - oldDate) / 100 / 60 >= 1) {
            var planets = ajaxRequest();
            var date = new Date();
            localStorage.setItem('date', date );
            localStorage.setItem('planets',JSON.stringify(planets));
            }
      } else {

        var planets = ajaxRequest();
        var date = new Date();
        localStorage.setItem('date', date);
        localStorage.setItem('planets',JSON.stringify(planets));
    }

  //  var planets = "";

  /*$.get( "http://swapi.co/api/planets/", function(data) {
      planets = data.results;
    });*/


      var html = "";
      html += "<div id='planet-list'>";
      html += "<ul>";

        $.each(JSON.parse(localStorage.getItem('planets')), function(key, value) {
          html += "<li data-url='" + value.url + "'>" + value.name + "</li>";
        })

      html += "</ul>";
      html += "</div>";
      $('main').html('');
      $('main').append(html);
      $('main').on('click', '#planet-list li', getOnePlanet);
      $('button[data-action="home"]').on('click', getAllPlanets);
      destroyLoadingScreen();

  }
});

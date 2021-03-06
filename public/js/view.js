$(document).ready(function() {
  // Getting a reference to the input field where user adds a new burger
  var $newItemInput = $("input.new-item");
  // Our new burgers will go inside the burgerContainer
  var $burgerContainer = $(".burger-container");
  var $burgerContainerPerm = $(".burger-container-perm");
  // Adding event listeners for deleting, editing, and adding burgers
  $(document).on("click", "button.delete", deleteBurger);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".burger-item", editBurger);
  $(document).on("keyup", ".burger-item", finishEdit);
  $(document).on("blur", ".burger-item", cancelEdit);
  $(document).on("submit", "#burger-form", insertBurger);

  // Our initial burgers array
  var burgers = [];
  var burgersperm = [];
  // Getting burgers from database when page loads
  getburgers();
  getburgersperm();

  // This function resets the burgers displayed with new burgers from the database
  function initializeRows() {
    $burgerContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < burgers.length; i++) {
      rowsToAdd.push(createNewRow(burgers[i]));
    }
    $burgerContainer.prepend(rowsToAdd);
  }
  function initializeRowsPerm() {
    $burgerContainerPerm.empty();
    var rowsToAdd = [];
    for (var i = 0; i < burgersperm.length; i++) {
      rowsToAdd.push(createNewRow2(burgersperm[i]));
    }
    $burgerContainerPerm.prepend(rowsToAdd);
  }
  // This function grabs burgers from the database and updates the view
  function getburgers() {
    $.get("/api/burgers", function(data) {
      burgers = data;
      initializeRows();
    });
  }

  function getburgersperm() {
    $.get("/api/burgers_perm", function(data) {
      burgersperm = data;
      initializeRowsPerm();
    });
  }
  // This function deletes a burger when the user clicks the delete button

  function deleteBurger(event) {
    event.stopPropagation();
    var id = $(this).data("id");
/* EXPECTED BEHAVIOR IS PLAY SOUND ON CLICK
     ACTUAL BEHAVIOR IS NOTHING HAPPENS
-- ATTEMPT TO UPDATE AUTOPLAYING PLAYER WITH VALID SOURCE
    $("#play").attr("src", $.get("api/play")).then($("#play").play())
-- ATTEMPT TO CALL <AUDIO ID=PLAYER> AND TELL IT TO PLAY  
    $("#player").play())
-- ALTERNATE ATTEMPT    
    $("button").on('click', function(){
    document.getElementById("player").play()
    });  
    TEST PASSED WITH W3SCHOOLS, BUT FAILED IN THIS IMPLEMENTATION
    https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_audio_all
    <!DOCTYPE html>
      <html>
      <body>
      <audio controls id="one">
        <source src="horse.ogg" type="audio/ogg">
        <source src="horse.mp3" type="audio/mpeg">
      </audio>  
      <script>
      document.getElementById("one").play()
      </script>
      </body>
      </html>
*/
    playSound();
    $.ajax({
      method: "DELETE",
      url: "/api/burgers/" + id
    }).then(getburgers);
  }
  
  function playSound() {
    $newInputRow.find("audio").attr("autoplay");
  }

  // This function handles showing the input box for a user to edit a burger
  function editBurger() {
    var currentBurger = $(this).data("burger");
    $(this).children().hide();
    $(this).children("input.edit").val(currentBurger.text);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  // Toggles complete status
  function toggleComplete(event) {
    event.stopPropagation();
    var burger = $(this).parent().data("burger");
    burger.complete = !burger.complete;
    updateBurger(burger);
  }

  // This function starts updating a burger in the database if a user hits the "Enter Key"
  // While in edit mode
  function finishEdit(event) {
    var updatedBurger = $(this).data("burger");
    if (event.which === 13) {
      updatedBurger.text = $(this).children("input").val().trim();
      $(this).blur();
      updateBurger(updatedBurger);
    }
  }

  // This function updates a burger in our database
  function updateBurger(burger) {
    $.ajax({
      method: "PUT",
      url: "/api/burgers",
      data: burger
    }).then(getburgers);
  }

  // This function is called whenever a burger item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var currentBurger = $(this).data("burger");
    if (currentBurger) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentBurger.text);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  // This function constructs a burger-item row
  function createNewRow(burger) {
    $newInputRow = $(
      [
        "<li class='list-group-item burger-item'>",
        "<span>",
        burger.text,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='delete btn btn-danger'>Devour it</button>",
        "<button class='complete btn btn-primary'>Favorite it</button>",
        "<audio id='player' autoplay> ",
        "<source id='eat' src='https://www.myinstants.com/media/sounds/sandwich_2.mp3'",
        //https://www.myinstants.com/media/sounds/nom-nom-nom_gPJiWn4.mp3'",
        "type='audio/mpeg'> </audio>",
        "</li>"
      ].join("")
    );
    $newInputRow.find("button.delete").data("id", burger.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("burger", burger);
    if (burger.complete) {
      $newInputRow.find("span").css("text-shadow", "0px 0px 10px green");
      $newInputRow.find("span").css("font-size", "2em");
      $newInputRow.find(".complete").text("UnFavorite it");
    }
    return $newInputRow;
  }

  // This function constructs a burger-item row
  function createNewRow2(burger) {
    var $newInputRow2 = $(
      [
        "<li class='list-group-item burger-item-perm'>",
        "<span>",
        burger.text,
        "</span>",
        "</li>"
      ].join("")
    );
    $newInputRow2.data("burger", burger);
    return $newInputRow2;
  }

  // This function inserts a new burger into our database and then updates the view
  function insertBurger(event) {
    event.preventDefault();
    var burger = {
      text: $newItemInput.val().trim(),
      complete: false
    };
    $.post("/api/burgers", burger, getburgers);
    $.post("/api/burgers_perm", burger, getburgersperm);
    $newItemInput.val("");
  }
});

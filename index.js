const API_BASE_URL = "https://destinations-listings.herokuapp.com/";

axios.get(API_BASE_URL).then((res) => displayDestination(res.data));
// fetch(API_BASE_URL)
//   .then((res) => res.json())
//   .then((data) => displayDestination(data));

let cardCont = document.querySelector("#dest_container");

function displayDestination(data) {
  for (let i = 0; i < data.length; i++) {
    const { uid, name, location, photo, description } = data[i];
    const newCard = newDestinationCard(name, location, photo, description)
    newCard.setAttribute("uid", uid)
    cardCont.appendChild(newCard);
  }
}

// Listen for form being submitted
let destFormInfo = document.querySelector("#destination_details");
destFormInfo.addEventListener("submit", handleFormSubmit);

// change wishlist title if cards are present
if (cardCont.children.length >= 0) {
  document.querySelector("#cont_text").innerHTML = "My Wishlist";
}

function handleFormSubmit(evnt) {
  evnt.preventDefault(); // stops form refreshing

  // retreive values from form, store in variables
  const destination = evnt.target.name.value;
  const location = evnt.target.location.value;
  //const photo = await getPhoto(destination);
  const desc = evnt.target.desc.value;

  axios
    .post(API_BASE_URL, {
      name: destination,
      location: location,
      description: desc,
    })
    .then(() => {
      window.location.reload();
    });

  // reset form values on submit
  resetFields(evnt.target);

  // // create new card and appends it to the card container
  // let newCard = newDestinationCard(destination, location, photo, desc);
  // cardCont.appendChild(newCard);
  //window.location.reload();
}

// retreives photo object from unsplash based on destination input
// async function getPhoto(dest) {
//   const API = `https://api.unsplash.com/search/photos/?client_id=6y9nBfaCC-54q2g0n2ltrwdJnJJbvG1sFpxYu6Isp7Y&query=${dest}&page=1&per_page=1`;

//   try {
//     let picResult = await fetch(API);
//     let json = await picResult.json();
//     console.log(json.results);
//     return json.results[0].urls.thumb;
//   } catch (err) {
//     console.log(err);
//   }
// }

// creates new destinaton card based on user input
function newDestinationCard(dest, loc, photo, desc) {
  // creates new container for card
  let container = document.createElement("div");
  container.setAttribute("class", "card text-center m-2");
  container.setAttribute("style", "width: 15rem; height: fit-content");
  // sets card picture in card to thumbnail in value returned from unsplash
  let pic = document.createElement("img");
  pic.src = photo;
  pic.setAttribute("class", "card-img-top");
  container.appendChild(pic);
  // creates inner div for info and button container
  let innerDiv = document.createElement("div");
  innerDiv.setAttribute("class", "card-body");
  container.appendChild(innerDiv);
  // creates title of card based on uer input destination name
  let name = document.createElement("h5");
  name.innerHTML = dest;
  name.setAttribute("class", "card-title");
  innerDiv.appendChild(name);
  // creates sub-heading based on user input location
  let location = document.createElement("h6");
  location.innerHTML = loc;
  location.setAttribute("class", "card-text");
  innerDiv.appendChild(location);
  // creates description paragraph based on user input description
  let description = document.createElement("p");
  description.innerHTML = desc;
  description.setAttribute("class", "card-text");
  innerDiv.appendChild(description);
  //create button container
  let btnDiv = document.createElement("div");
  btnDiv.setAttribute("class", "buttons_container");
  innerDiv.appendChild(btnDiv);
  // insert edit button
  let editBtn = document.createElement("button");
  editBtn.setAttribute("class", "btn btn-warning");
  editBtn.innerHTML = "edit";
  editBtn.addEventListener("click", editCard)
  btnDiv.appendChild(editBtn);
  //insert delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "btn btn-danger");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.addEventListener("click", deleteCard);
  btnDiv.appendChild(deleteBtn);

  return container;
}

function resetFields(form) {
  for (var i = 0; i < form.length; i++) {
    form.elements[i].value = "";
  }
}

function editCard(evnt) {
    const target = evnt.target.parentElement.parentElement.parentElement;
    const uid = target.getAttribute("uid");
    console.log(uid)
    const name = prompt("Enter new name:");
    const location = prompt("Enter new location:");
    const description = prompt("Enter new description:");

    axios
      .put(
        API_BASE_URL,
        {
          name,
          location,
          description
        },
        {
          params: {
            uid
          },
        }
      )
      .then((response) => response.status)
      .catch((err) => console.log(err))
      .then(() => {
        window.location.reload();
      });
}

function deleteCard(evnt) {
    const target = evnt.target.parentElement.parentElement.parentElement;
    const uid = target.getAttribute("uid");
    console.log(uid)
    axios.delete(API_BASE_URL, { 
        params: {       
            uid
        }
    }).then(() => {
        window.location.reload();
    })
}

var axios = require("axios");
var clientConfig = require("../clientConfig")
var root = clientConfig.appUrl;

export const getCurrentProvider = () =>  {
  return axios.post(root + "/providers/getCurrentProvider", {});
};

export const inviteUser = (email) => {
  return axios.post(root + "/providers/inviteUser", { email });
}

export const createGigs = (gig) =>  {
  var formData = new FormData();
  var packagesJson = JSON.stringify(gig.packages)
  formData.append("packages", packagesJson);
  formData.append("primaryCategory", gig.primaryCategory); // number 123456 is immediately converted to a string "123456"
  formData.append("secondaryCategory", gig.secondaryCategory);
  formData.append("description", gig.description);
  formData.append("instruction", gig.instruction);
  formData.append("name", gig.name);
  formData.append("gigImage", gig.image);
  formData.append("id", gig.id);
  return axios.post(root + "/providers/AddOrUpdateGig", formData);
};
export const providerSettings = (data) =>  {
  var formData = new FormData();
  var availabilityJson = JSON.stringify(data.availability)
  var skillJson = JSON.stringify(data.skills)
  var languagesJson = JSON.stringify(data.languages)
  var educationJson = JSON.stringify(data.education)

  formData.append("availability", availabilityJson);
  formData.append("skills", skillJson); // number 123456 is immediately converted to a string "123456"
  formData.append("languages", languagesJson);
  formData.append("education", educationJson);
  formData.append("biography", data.biography);
  formData.append("description", data.description);
  formData.append("freeConsulation", data.freeConsulation);
  formData.append("websiteLink", data.websiteLink);
  formData.append("linkedinLink", data.linkedinLink);
  formData.append("facebookLink", data.facebookLink);
  formData.append("twitterLink", data.twitterLink);
  formData.append("portfolioLink", data.portfolioLink);
  formData.append("contactNumber", data.contactNumber);
  formData.append("contactEmail", data.contactEmail);
  formData.append("name", data.name);
  // HTML file input, chosen by user
  formData.append("profileImage", data.image);
  debugger;
  return axios.post(root + "/providers/ProviderDetails", formData);

};

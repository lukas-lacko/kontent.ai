// Reference the input fields and fetch button
const bearerTokenInput = document.getElementById('bearerToken');
const subscriptionIdInput = document.getElementById('subscriptionId');
const fetchButton = document.getElementById('fetchButton');

    let continuationToken = null;

    // Function to fetch and display user data
    function fetchAllUserData() {
      const extractedData = [];
      const apiUrl = `https://manage.kontent.ai/v2/subscriptions/${subscriptionIdInput.value}/users`; // API endpoint
      const bearerToken = bearerTokenInput.value; // Get the user-entered token

      // Create a recursive function to fetch data until there's no more pagination token
      function fetchPageOfData() {
        // Create the URL for the API request, including the continuation token if present
        const url = `${apiUrl}`;

        // Create headers with the Bearer token and continuation token if present
        const headers = {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        };
        
        if (continuationToken) {
          headers['x-continuation'] = continuationToken;
        }

        fetch(url, {
          method: 'GET',
          headers: headers,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            // Handle the JSON data here
            const jsonData = data;
            continuationToken = data.pagination.continuation_token;

            // Append user data to the list
            jsonData.users.forEach((user) => {
                const userId = user.id;
                const firstName = user.first_name;
                const lastName = user.last_name;
                const email = user.email;

              // Push the extracted data into the array
              extractedData.push({
                firstName,
                lastName,
                email,
                userId
            });

                // Iterate through the projects for each user
                user.projects.forEach(project => {
                    const projectId = project.id;
                    const projectName = project.name; 
                    extractedData.push({
                      projectId,
                      projectName,
                    });

                    project.environments.forEach(environment => {
                      const envId = environment.id;
                      const envName = environment.name;
                      const isActive = environment.is_user_active;
                      const lastActivityAt = environment.last_activity_at;


                        // Push the extracted data into the array
                        extractedData.push({
                            envId,
                            envName,
                            isActive,
                            lastActivityAt
                            
                        });
                  });
                });
            });

            // If there's a continuation token, fetch the next page of data
            if (continuationToken) {
              fetchPageOfData();
            }
            
            //If there is no continuation token anymore, I can extract complete data
            else { 

            console.log(extractedData)

            // Define the fields you want to include in the CSV
            const fields = ['firstName', 'lastName', 'email', 'projectId', 'projectName', 'envId', 'envName', 'isActive', 'lastActivityAt', 'userId'];

            // Create a CSV header with field names
            const csvHeader = fields.join(';') + '\n';

            // Create a CSV content by joining the data
            const csvContent = extractedData.map(item => fields.map(field => item[field]).join(';')).join('\n');

            // Combine header and content
            const csv = csvHeader + csvContent;

            // Create a Blob with the CSV data
            const blob = new Blob([csv], { type: 'text/csv' });

            // Create a download link
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);

            // Specify the file name for the download
            a.download = `users_export`;
            // Trigger a click event on the link to start the download
            a.click();
            

            }

          })
          .catch((error) => {
          console.error('Error:', error);
          // Display the error message on the website
          errorContainer.textContent = `Error: ${error.message}`;
          });
      }

      // Start fetching data
      fetchPageOfData();

      }

    // Initial fetch to load all pages of data
    //fetchAllUserData();
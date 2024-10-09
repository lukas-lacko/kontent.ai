// Reference the input fields and fetch button
const bearerTokenInput = document.getElementById('bearerToken');
const envIdInput = document.getElementById('envId');
const fetchButton = document.getElementById('fetchButton');

    let continuationToken = null;

    // Function to fetch and display assets data
    function fetchAllUserData() {
      const extractedData = [];
      const apiUrl = `https://manage.kontent.ai/v2/projects/${envIdInput.value}/assets`; // API endpoint
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

            // Append asset data to the list
            jsonData.assets.forEach((asset) => {
                const file_name = asset.file_name;
                const id = asset.id;
                const foldId = asset.folder && asset.folder.id ? asset.folder.id : 'No Folder';
                const url = asset.url;

              // Push the extracted data into the array
              extractedData.push({
                file_name,
                id,
                foldId,
                url,
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
            const fields = ['file_name', 'id', 'foldId', 'url'];

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
            a.download = `asset_list_export`;
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

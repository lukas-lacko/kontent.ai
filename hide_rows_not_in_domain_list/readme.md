## VBA Script for Filtering Email Domains

This VBA script hides rows for email addresses not included in your specified domain list.

### How to Use:

1. **Open the Excel File:**
   Open the Excel file in which you need to filter the data.

2. **Create a New Worksheet:**
   - Add a new sheet named **Domains**.
   - List all the email domains you want to filter by in column A. The script can handle also the domains in single quotes or with @ in front of them. So for instance, they can be listed as:
     - `breakfastmail.com`
     - `'magicmail.net'`
     - `@example.com`

3. **Add the VBA Code:**
   - Open the VBA editor (Alt + F11).
   - Insert a new module (Insert > Module).
   - Copy and paste the provided VBA code into the module.

4. **Run the Macro:**
   - Close the VBA editor.
   - Press Alt + F8, select FilterByDomain, and click Run.

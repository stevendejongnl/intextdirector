# Internal External Redirector

This is a simple web application that checks whether a request originates from an internal or external network. It allows you to specify both internal and external URLs and redirects based on the network source.


## Features

- Accepts query parameters: `intern` and `extern`
- Determines the network source and redirects accordingly


## Usage

1. Provide both `intern` and `extern` query parameters in the URL to define the internal and external URLs.

   Example URL:
   ```
   http://localhost:8080/?intern=http://192.168.2.5:6000&extern=https://example.com
   ```

2. The app will perform the following:
   - Check if the internal URL is accessible.
   - If accessible, it compares the local IP address with the hostname of the external URL to determine if the request comes from an internal network.
   - Redirects to the appropriate URL based on the determination.


## Getting Started

### Docker

1. Build the Docker container:
   ```
   docker build -t intextdirector .
   ```

2. Run the Docker container:
   ```
   docker run -p 8080:8080 intextdirector
   ```

3. Access the app in your browser by navigating to:
   ```
   http://localhost:8080
   ```


### Docker Compose

1. Open a terminal and run the following command:
   ```
   docker-compose up
   ```

   This will build the Docker image and start the container.

2. Access the app in your browser by navigating to:
   ```
   http://localhost:8080
   ```


## Customization

You can customize the behavior of the app by modifying the `app.py` file. Feel free to adjust the code to fit your specific use case.


## License

This project is licensed under the [MIT License](LICENSE).

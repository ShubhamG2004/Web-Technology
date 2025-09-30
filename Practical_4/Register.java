import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
/**
* Servlet implementation class Register
*/
@WebServlet("/Register")
public class Register extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws
			ServletException, IOException {
		// Set response content type
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		// Read form data
		String name = request.getParameter("name");
		String email = request.getParameter("email");
		String department = request.getParameter("department");
		// Database connection parameters
		String jdbcURL = "jdbc:mysql://localhost:3306/databasename";
		String dbUser = "root";
		String dbPassword = "mysqlpassword";
		try {
			// Load JDBC driver
			Class.forName("com.mysql.cj.jdbc.Driver");
			// Connect to the database
			Connection connection = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
			// SQL query to insert data
			String sql = "INSERT INTO emp (name, email, department) VALUES (?, ?, ?)";
			PreparedStatement statement = connection.prepareStatement(sql);
			statement.setString(1, name);
			statement.setString(2, email);
			statement.setString(3, department);
			int rowsInserted = statement.executeUpdate();

			if (rowsInserted > 0) {
				out.println("<h3>Employee registered successfully!</h3>");
			} else {
				out.println("<h3>Error registering employee.</h3>");
			}
			connection.close();
		} catch (Exception e) {
			out.println("<h3>Error: " + e.getMessage() + "</h3>");
			e.printStackTrace(out);
		}
	}
}
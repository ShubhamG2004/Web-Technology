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
 * Servlet implementation class Register (Student)
 */
@WebServlet("/Register")
public class Register extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String course = request.getParameter("course");
        String semester = request.getParameter("semester");

        // DB config - update to your local values
        String jdbcURL = "jdbc:mysql://localhost:3306/databasename";
        String dbUser = "root";
        String dbPassword = "mysqlpassword";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);

            String sql = "INSERT INTO student (name, email, course, semester) VALUES (?, ?, ?, ?)";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, name);
            statement.setString(2, email);
            statement.setString(3, course);
            statement.setInt(4, Integer.parseInt(semester));

            int rowsInserted = statement.executeUpdate();

            if (rowsInserted > 0) {
                out.println("<h3>Student registered successfully!</h3>");
            } else {
                out.println("<h3>Error registering student.</h3>");
            }
            connection.close();
        } catch (Exception e) {
            out.println("<h3>Error: " + e.getMessage() + "</h3>");
            e.printStackTrace(out);
        }
    }
}

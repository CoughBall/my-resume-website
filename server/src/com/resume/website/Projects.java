package com.resume.website;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

@WebServlet("/projects")
public class Projects extends HttpServlet
{
	private static final long serialVersionUID = -6637000232055748216L;

	@Override
	public void doGet(HttpServletRequest httpRequest, HttpServletResponse HttpResponse) throws IOException, ServletException
	{
		CloseableHttpClient httpclient = HttpClients.createDefault();
		PrintWriter out = HttpResponse.getWriter();
		try
		{
			HttpUriRequest githubHttpRequest = createHttpRequest();
			ResponseHandler<String> responseHandler = response ->
			{
				int status = response.getStatusLine().getStatusCode();
				if (status >= HttpServletResponse.SC_OK && status < HttpServletResponse.SC_NOT_MODIFIED)
				{
					HttpEntity entity = response.getEntity();
					return entity != null ? EntityUtils.toString(entity) : null;
				} 
				else
				{
					throw new ClientProtocolException("Unexpected response status: " + response);
				}
			};
			String responseBody = httpclient.execute(githubHttpRequest, responseHandler);			
			HttpResponse.setCharacterEncoding(StandardCharsets.UTF_8.name());
	        out.print(responseBody);
		} 
		finally
		{
			out.flush();
			httpclient.close();
		}
	}

	private HttpUriRequest createHttpRequest() throws UnsupportedEncodingException
	{
		final String ACCESS_TOKEN = "";
		// setting custom http headers on the http request
		// http body - graphql query encoded in json format
		StringEntity messageBody = new StringEntity(
				   "{ \"query\":\""
					+ "query{ user (login: CoughBall) { repositories (first: 50, isFork: false) { nodes { name url description repositoryTopics(first: 10) { edges { node { topic { name } } } } } } } } \" }");
		// uri and headers
		HttpUriRequest githubHttpRequest = RequestBuilder.post()
				.setUri("https://api.github.com/graphql?access_token=" + ACCESS_TOKEN)
				.setHeader(HttpHeaders.CONTENT_TYPE, "application/json")
				.setHeader(HttpHeaders.ACCEPT, "application/json")
				.setEntity(messageBody)
				.build();
		return githubHttpRequest;
	}
}
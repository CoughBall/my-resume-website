package com.resume.website;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.filters.CorsFilter;

@WebFilter("/projects")
public class ProjectsCorsFilter implements Filter
{

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filter) throws IOException, ServletException
	{
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		response.setHeader(CorsFilter.RESPONSE_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, "*");
		response.setHeader(CorsFilter.RESPONSE_HEADER_ACCESS_CONTROL_ALLOW_METHODS, "GET");
		filter.doFilter(servletRequest, servletResponse);
	}

}

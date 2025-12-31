output "frontend_url" {
  value = "https://${var.domain_name}"
}
output "cloudfront_id" {
  description = "ID de la distribución CloudFront"
  value       = aws_cloudfront_distribution.frontend.id
}

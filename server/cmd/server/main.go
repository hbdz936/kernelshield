package main

import (
	"log"
	"net"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yourcompany/kernelshield/server/internal/api/grpc"
	v1 "github.com/yourcompany/kernelshield/server/internal/api/rest/v1"
	"github.com/yourcompany/kernelshield/server/internal/db"
	grpcLib "google.golang.org/grpc"
)

func main() {
	log.Println("==========================================================")
	log.Println("   KERNELSHIELD MANAGEMENT SERVER & DECISION CONSOLE (v1) ")
	log.Println("==========================================================")

	// 1. Initialize DB & Broadcaster
	dsn := "host=localhost user=postgres password=postgres dbname=kernelshield port=5432 sslmode=disable"
	database, _ := db.InitDB(dsn)
	db.SetupTimescaleDB(database)

	_ = v1.InitBroadcaster()

	// 2. Start gRPC Server in background
	go func() {
		lis, err := net.Listen("tcp", ":50051")
		if err != nil {
			log.Printf("[gRPC] Warning: listener error on :50051 (%v)", err)
			return
		}
		grpcServer := grpcLib.NewServer()
		ingestion := grpc.NewIngestionServer()
		_ = ingestion
		log.Println("[gRPC Server] Listening on :50051 for agent ingestion & heartbeats...")
		if err := grpcServer.Serve(lis); err != nil {
			log.Printf("[gRPC Server] Error: %v", err)
		}
	}()

	// 3. Start Gin REST API Engine
	r := gin.Default()

	// CORS Configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API v1 Routes
	apiV1 := r.Group("/api/v1")
	{
		apiV1.POST("/alerts", v1.HandlePostAlert)
		apiV1.GET("/alerts", v1.HandleGetAlerts)
		apiV1.GET("/alerts/stream", v1.HandleAlertStream)
		apiV1.GET("/metrics/overview", v1.HandleGetMetrics)

		apiV1.GET("/endpoints", v1.HandleGetEndpoints)

		apiV1.GET("/policies", v1.HandleGetPolicies)
		apiV1.POST("/policies", v1.HandlePostPolicy)

		apiV1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "healthy",
				"service": "kernelshield-server",
				"version": "1.0.0",
			})
		})
	}

	log.Println("[REST API] KernelShield REST API listening on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("[REST API] Server failed to start: %v", err)
	}
}

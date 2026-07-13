# ===== Stage 1: Build React (Vite) frontend =====
FROM node:20-alpine AS client-build
WORKDIR /client
COPY client-app/package*.json ./
RUN npm install
COPY client-app/ ./
RUN npm run build

# ===== Stage 2: Build .NET backend =====
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY gatherly.sln ./
COPY API/API.csproj ./API/
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/
COPY Persistence/Persistence.csproj ./Persistence/

RUN dotnet restore API/API.csproj

COPY . .
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/publish

# ===== Stage 3: Final runtime image =====
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=client-build /client/dist ./wwwroot

EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]